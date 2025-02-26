export default async function DestinationPage({ destinationId }) {
  await new Promise((resolve) => {
    setTimeout(resolve, 2000);
  });

  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${postId}`,
    { cache: "no-store" } // Ensures fresh data each time
  );

  if (!response.ok) {
    throw new Error("Failed to fetch post details");
  }

  const post = await response.json();

  return (
    <div
      style={{
        padding: "20px",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h3 style={{ marginBottom: "10px", color: "#333" }}>{post.title}</h3>
      <p style={{ color: "#555", lineHeight: "1.6" }}>{post.body}</p>
    </div>
  );
}
