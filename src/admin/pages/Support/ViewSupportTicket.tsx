import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FiArrowLeft, FiSend } from "react-icons/fi";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

/* ================= TYPES ================= */

interface Ticket {
  id: number;
  ticketId: string;
  userName: string;
  userEmail: string;
  subject: string;
  category: "Booking" | "Payment" | "Technical" | "Other";
  status: "Open" | "In Progress" | "Resolved";
  createdAt: string;
  messages: { from: "user" | "admin"; message: string; date: string }[];
}

/* ================= DATE FORMAT ================= */

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/* ================= MOCK DATA ================= */

const mockTickets: Ticket[] = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  ticketId: `TICK${1000 + i}`,
  userName: `User ${i + 1}`,
  userEmail: `user${i + 1}@gmail.com`,
  subject: i % 2 === 0 ? "Issue with booking" : "Payment not processed",
  category: ["Booking", "Payment", "Technical", "Other"][i % 4] as any,
  status: ["Open", "In Progress", "Resolved"][i % 3] as any,
  createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  messages: [
    {
      from: "user",
      message: "I need help with my booking.",
      date: new Date("2026-02-10T10:30:00").toISOString(),
    },
    {
      from: "admin",
      message: "Sure, please provide your booking ID.",
      date: new Date("2026-02-11T14:15:00").toISOString(),
    },
  ],
}));

/* ================= COMPONENT ================= */

export default function SupportTicketView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const ticket = mockTickets.find((t) => t.id === Number(id));

  const [messages, setMessages] = useState(ticket?.messages || []);
  const [reply, setReply] = useState("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [status, setStatus] = useState(ticket?.status);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!ticket) {
    return (
      <div className="p-6 text-center text-red-600">
        Ticket not found
      </div>
    );
  }

  const handleSendReply = () => {
    if (!reply.trim() && !attachedFile) return;

    const newMessage = {
      from: "admin" as const,
      message:
        reply +
        (attachedFile ? ` [File: ${attachedFile.name}]` : ""),
      date: new Date().toISOString(),
    };

    setMessages([...messages, newMessage]);
    setReply("");
    setAttachedFile(null);
  };

  const handleConfirmResolve = () => {
    setStatus("Resolved");
    setIsResolveModalOpen(false);
  };

  return (
    <div>
      <PageMeta
        title={`Ticket ${ticket.ticketId}`}
        description="View support ticket"
      />
      <PageBreadcrumb pageTitle={`Ticket ${ticket.ticketId}`} />

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 mb-4 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
      >
        <FiArrowLeft /> Back
      </button>

      <div className="max-w-8xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow border dark:border-gray-700 flex flex-col h-[80vh]">

        {/* HEADER */}
        <div className="p-6 border-b dark:border-gray-700 space-y-3">

          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-semibold dark:text-white">
                {ticket.subject}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Ticket ID: {ticket.ticketId} | Category: {ticket.category}
              </p>
              <p className="mt-1 text-sm">
                Status:{" "}
                <span
                  className={`font-medium ${
                    status === "Resolved"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {status}
                </span>
              </p>
            </div>

            {status !== "Resolved" && (
              <button
                onClick={() => setIsResolveModalOpen(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Mark as Resolved
              </button>
            )}
          </div>

          {/* SMALL USER INFO SECTION */}
          <div className="flex items-center justify-between text-sm border-t pt-3 dark:border-gray-700">
            <div className="flex items-center gap-6">
              <div>
                <span className="text-gray-500 dark:text-gray-400">User:</span>{" "}
                <span className="font-medium dark:text-white">
                  {ticket.userName}
                </span>
              </div>

              <div>
                <span className="text-gray-500 dark:text-gray-400">Email:</span>{" "}
                <span className="font-medium dark:text-white">
                  {ticket.userEmail}
                </span>
              </div>
            </div>

            <div className="text-gray-400 text-xs">
              Created: {formatDateTime(ticket.createdAt)}
            </div>
          </div>
        </div>

        {/* CONVERSATION */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${
                msg.from === "user" ? "items-start" : "items-end"
              }`}
            >
              <div
                className={`p-3 rounded-lg max-w-lg break-words ${
                  msg.from === "user"
                    ? "bg-gray-100 dark:bg-gray-800"
                    : "bg-blue-600 dark:bg-blue-700 text-white"
                }`}
              >
                <p>{msg.message}</p>
              </div>

              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formatDateTime(msg.date)}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* REPLY BOX */}
        {status !== "Resolved" && (
          <div className="p-4 border-t dark:border-gray-700 flex items-center gap-2">
            <input
              type="text"
              placeholder="Write a reply..."
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSendReply();
                }
              }}
              className="flex-1 border rounded-lg px-3 py-2 dark:bg-gray-800"
            />

            <label className="flex items-center px-3 py-2 border rounded-lg cursor-pointer dark:bg-gray-800 dark:border-gray-700">
              📎
              <input
                type="file"
                onChange={(e) =>
                  setAttachedFile(
                    e.target.files ? e.target.files[0] : null
                  )
                }
                className="hidden"
              />
            </label>

            <button
              onClick={handleSendReply}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1"
            >
              <FiSend /> Send
            </button>
          </div>
        )}
      </div>

      {/* RESOLVE CONFIRMATION MODAL */}
      {isResolveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-semibold mb-3 dark:text-white">
              Mark Ticket as Resolved?
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to mark ticket{" "}
              <span className="font-medium">{ticket.ticketId}</span> as resolved?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsResolveModalOpen(false)}
                className="px-4 py-2 rounded-lg border dark:border-gray-700"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmResolve}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Yes, Resolve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}