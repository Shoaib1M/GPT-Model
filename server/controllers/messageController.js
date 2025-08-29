//text based ai chat message controller

import axios from "axios";
import Chat from "../models/Chat.js";
import imagekit from "../configs/imageKit";
import openai from "../configs/openai.js";

export const textMessageController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { chatId, prompt } = req.body;

    const chat = await Chat.findOne({ userId, _id: chatId });
    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
    });
    const { choices } = await openai.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });
    const reply = {
      ...choices[0].message,
      timestamp: Date.now(),
      isImage: false,
    };
    res.json({ success: true, reply });

    chat.messages.push(reply);

    await chat.save();
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//Image generation

export const imageMessageController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { prompt, chatId, isPublished } = req.body;
    //find chat
    const chat = await Chat.findOne({ userId, _id: chatId });
    //push user message
    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
    });
    //encode the prompt
    const encodedPrompt = encodeURIComponent(prompt);

    //construct imagekit ai generation url

    const generatedImageURL = `${
      process.env.IMAGEKIT_URL_ENDPOINT
    }/ik-genimg-prompt-${encodedPrompt}/quickgpt/${Date.now()}.png?tr=w-800,h-800`;
    const aiImageResponse = await axios.get(generatedImageURL, {
      responseType: "arraybuffer",
    });

    //converting to base64 image

    const base64Image = `data:image/png;base64,${Buffer.from(
      aiImageResponse.data,
      "binary"
    ).toString("base64")}`;

    //upload to imagekit media library

    const uploadResponse = await imagekit.upload({
      file: base64Image,
      fileName: `${Date.now()}.png`,
      folder: "quickgpt",
    });

    const reply = {
      role: "assistant",
      content: uploadResponse.url,
      timestamp: Date.now(),
      isImage: true,
      isPublished,
    };
    res.json({ success: true, reply });
    chat.messages.push(reply);
    await chat.save();
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
