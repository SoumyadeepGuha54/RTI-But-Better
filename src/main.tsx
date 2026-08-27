import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { DemoStoreProvider } from "./store/DemoStore";
import { ChatbotProvider } from "./components/chatbot/Chatbot";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <DemoStoreProvider>
        <ChatbotProvider><App /></ChatbotProvider>
      </DemoStoreProvider>
    </BrowserRouter>
  </StrictMode>,
);
