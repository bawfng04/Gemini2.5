const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { sql, getPool } = require("./dbConfig"); // Import db config
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors()); // Allow requests from your React app's origin
app.use(express.json()); // Parse JSON request bodies

// --- Gemini API Setup ---
if (!process.env.GEMINI_API_KEY) {
  console.error("FATAL ERROR: GEMINI_API_KEY environment variable not set.");
  process.exit(1); // Exit if API key is missing
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro-exp-03-25" });

// --- Database Helper Function ---
const saveMessage = async (conversationId, sender, content) => {
  try {
    const pool = await getPool();
    await pool
      .request()
      .input("ConversationID", sql.Int, conversationId)
      .input("Sender", sql.NVarChar(50), sender)
      .input("Content", sql.NVarChar(sql.MAX), content)
      .query(
        "INSERT INTO Messages (ConversationID, Sender, Content) VALUES (@ConversationID, @Sender, @Content)"
      );
    console.log(
      `Message saved: [ConvID: ${conversationId}, Sender: ${sender}]`
    );
  } catch (err) {
    console.error("Error saving message to DB:", err);
    // Decide if you want to throw the error or just log it
    // throw err; // Or handle gracefully
  }
};

// --- API Routes ---

// Endpoint to start a new chat or continue an existing one
app.post("/api/chat", async (req, res) => {
  try {
    const { message, conversationId: convIdFromRequest } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message content is required." });
    }

    let conversationId = convIdFromRequest;
    const pool = await getPool();

    // 1. Determine or Create Conversation ID
    if (!conversationId) {
      // Create a new conversation
      const result = await pool
        .request()
        .query(
          "INSERT INTO Conversations DEFAULT VALUES; SELECT SCOPE_IDENTITY() AS ConversationID;"
        );
      conversationId = result.recordset[0].ConversationID;
      console.log(`New conversation started: ID ${conversationId}`);
    } else {
      // Optional: Verify conversation exists (good practice)
      const checkConv = await pool
        .request()
        .input("ConversationID", sql.Int, conversationId)
        .query(
          "SELECT 1 FROM Conversations WHERE ConversationID = @ConversationID"
        );
      if (checkConv.recordset.length === 0) {
        console.warn(
          `Conversation ID ${conversationId} not found. Starting new one.`
        );
        const result = await pool
          .request()
          .query(
            "INSERT INTO Conversations DEFAULT VALUES; SELECT SCOPE_IDENTITY() AS ConversationID;"
          );
        conversationId = result.recordset[0].ConversationID;
      }
    }

    // 2. Save User Message to DB
    await saveMessage(conversationId, "USER", message);

    // 3. Fetch conversation history (for context) - Optional but recommended
    const historyResult = await pool
      .request()
      .input("ConversationID", sql.Int, conversationId)
      .query(
        "SELECT Sender, Content FROM Messages WHERE ConversationID = @ConversationID ORDER BY Timestamp ASC"
      );

    const history = historyResult.recordset.map((row) => ({
      role: row.Sender === "USER" ? "user" : "model",
      parts: [{ text: row.Content }],
    }));

    // 4. Call Gemini API
    console.log(`Sending request to Gemini for ConvID: ${conversationId}`);
    const chat = model.startChat({ history: history }); // Pass history
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const geminiText = response.text();

    // 5. Save Gemini Response to DB
    await saveMessage(conversationId, "GEMINI", geminiText);

    // 6. Send Response to Frontend
    res.json({
      response: geminiText,
      conversationId: conversationId, // Send back the ID (useful if it was newly created)
    });
  } catch (error) {
    console.error("Error in /api/chat:", error);
    res.status(500).json({
      error: "An error occurred while processing your request.",
      details: error.message,
    });
  }
});

// Endpoint to fetch messages for a specific conversation
app.get("/api/chat/:conversationId", async (req, res) => {
  try {
    const { conversationId } = req.params;
    const pool = await getPool();

    const result = await pool
      .request()
      .input("ConversationID", sql.Int, conversationId).query(`
                SELECT MessageID, Sender, Content, Timestamp
                FROM Messages
                WHERE ConversationID = @ConversationID
                ORDER BY Timestamp ASC
            `);

    res.json(result.recordset); // Send the array of messages
  } catch (error) {
    console.error(
      `Error fetching messages for conversation ${req.params.conversationId}:`,
      error
    );
    res.status(500).json({ error: "Failed to fetch chat history." });
  }
});

// --- Start Server ---
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
  getPool(); // Initialize pool on server start
});
