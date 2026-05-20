import api from '../../api';
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

export default function MessageModal({ selfData, userData }) {
    const [message, setMessage] = useState('')
    const [sending, setSending] = useState(false)

    const handleSendMessage = async () => {
        if (!message.trim()) return toast.error('Please write a message first');
        setSending(true);
        try {
            await api.post(
                '/api/conversation/add-conversation',
                { recieverId: userData?._id, message },
                { withCredentials: true }
            );
            toast.success('Message sent! Opening conversation...');
            setTimeout(() => window.location.href = '/message', 1200);
        } catch (err) {
            console.log(err);
            toast.error(err?.response?.data?.error || 'Failed to send message');
        } finally {
            setSending(false);
        }
    }

    return (
        <div className="my-5">
            <div className="w-full mb-4">
                <p className="text-sm text-gray-500 mb-2">Send a message to <strong>{userData?.f_name}</strong></p>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="p-2 mt-1 w-full border-1 rounded-md focus:outline-none focus:border-purple-600"
                  placeholder="Write your message..."
                  cols={10}
                  rows={6}
                />
            </div>
            <div
              onClick={!sending ? handleSendMessage : undefined}
              className={`rounded-xl w-fit px-4 py-2 text-white cursor-pointer transition-colors ${sending ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-900 hover:bg-purple-800'}`}
            >
              {sending ? 'Sending...' : 'Send Message'}
            </div>
            <ToastContainer position="top-center" autoClose={2000} />
        </div>
    )
}