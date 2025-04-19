function About() {
  return (
    
    <div className="mx-auto" style={{ maxWidth: "900px" }}>
        <div className="container py-0 text-dark">
        <h1 className="mb-4">About This App</h1>      
        <p>
            <strong>Order Manager</strong> is a demonstration application built to showcase a modern,
            real-time web application using React, TypeScript, SignalR/Websockets, and ASP.NET Core.
        </p>

        <p>
            It simulates a simple order management system where customer and order events are
            streamed in real-time via WebSockets, providing a responsive and dynamic user experience.
        </p>
        
        </div>
    </div>
  );
};

export default About;
