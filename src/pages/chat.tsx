import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

interface Property {
  id: string;
  title: string;
}

interface Message {
  sender: string;
  message: string;
  properties?: Property[];
}

export default function ChatBotPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', message: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/chat', { message: input });
      
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        message: res.data.response,
        properties: res.data.properties || []
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        message: 'Sorry, I encountered an error. Please try again later.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatMessage = (msg: string) => {
    return msg
      .replace(/\n/g, '<br />')
      .replace(/₹(\d+)/g, '₹$1')
      .replace(/(\d+BHK)/g, '<strong>$1</strong>');
  };

  const handlePropertyClick = (propertyId: string) => {
    router.push(`/property/${propertyId}`);
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <h2>Chat with PropertyBot 🏠</h2>

      <div style={{
        border: '1px solid #ddd',
        height: '400px',
        overflowY: 'auto',
        padding: '15px',
        marginBottom: '15px',
        background: '#f9f9f9',
        borderRadius: '8px',
      }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ 
            marginBottom: '12px',
            textAlign: msg.sender === 'user' ? 'right' : 'left'
          }}>
            <div style={{
              display: 'inline-block',
              background: msg.sender === 'user' ? '#e3f2fd' : '#f5f5f5',
              padding: '10px 15px',
              borderRadius: msg.sender === 'user' ? '18px 18px 0 18px' : '18px 18px 18px 0',
              maxWidth: '80%',
              wordBreak: 'break-word',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
            }}>
              <div dangerouslySetInnerHTML={{ __html: formatMessage(msg.message) }} />
              
              {msg.properties && msg.properties.length > 0 && (
                <div style={{ marginTop: '10px' }}>
                  {msg.properties.map((property) => (
                    <div
                      key={property.id}
                      onClick={() => handlePropertyClick(property.id)}
                      style={{
                        padding: '8px',
                        margin: '5px 0',
                        background: '#4CAF50',
                        color: 'white',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      View {property.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div style={{ textAlign: 'left' }}>
            <div style={{
              display: 'inline-block',
              background: '#f5f5f5',
              padding: '10px 15px',
              borderRadius: '18px 18px 18px 0',
            }}>
              Searching properties...
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about properties..."
          style={{ 
            flex: 1,
            padding: '12px',
            borderRadius: '20px',
            border: '1px solid #ddd',
            marginRight: '10px',
            fontSize: '16px'
          }}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          disabled={isLoading}
        />
        <button 
          onClick={sendMessage} 
          style={{ 
            padding: '12px 20px',
            borderRadius: '20px',
            border: 'none',
            background: '#4CAF50',
            color: 'white',
            cursor: 'pointer',
            fontSize: '16px'
          }}
          disabled={isLoading}
        >
          Send
        </button>
      </div>
    </div>
  );
}