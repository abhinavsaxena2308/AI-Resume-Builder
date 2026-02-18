
// Usage: node tests/api.test.js [ID_TOKEN]
// If no token provided, defaults to TEST_TOKEN for test mode

const API_URL = "http://localhost:3000/api/resumes";
const ID_TOKEN = process.argv[2] || "TEST_TOKEN";

console.log(`Using Token: ${ID_TOKEN.substring(0, 10)}...`);

const headers = {
  "Authorization": `Bearer ${ID_TOKEN}`,
  "Content-Type": "application/json"
};

async function testResumeFlow() {
  console.log("Starting API Test Flow...");

  // 1. Create Resume
  console.log("\n1. Creating Resume...");
  const createRes = await fetch(API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({
      title: "Test Resume",
      content: { personalInfo: { name: "Test User" } },
      context: { template: "modern", method: "test" }
    })
  });
  
  if (!createRes.ok) throw new Error(`Create failed: ${createRes.statusText}`);
  const { resumeId } = await createRes.json();
  console.log(`Created Resume ID: ${resumeId}`);

  // 2. Get Resume
  console.log("\n2. Fetching Resume...");
  const getRes = await fetch(`${API_URL}/${resumeId}`, { headers });
  if (!getRes.ok) throw new Error(`Get failed: ${getRes.statusText}`);
  const resume = await getRes.json();
  console.log("Fetched Resume:", resume.title);

  // 3. Update Resume
  console.log("\n3. Updating Resume...");
  const updateRes = await fetch(`${API_URL}/${resumeId}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      title: "Updated Test Resume",
      content: { personalInfo: { name: "Test User Updated" } },
      context: { section: "personalInfo" }
    })
  });
  if (!updateRes.ok) throw new Error(`Update failed: ${updateRes.statusText}`);
  console.log("Resume Updated.");

  // 4. Verify Update
  const verifyRes = await fetch(`${API_URL}/${resumeId}`, { headers });
  const updatedResume = await verifyRes.json();
  if (updatedResume.title !== "Updated Test Resume") throw new Error("Update verification failed");
  console.log("Update Verified.");

  // 5. Delete Resume
  console.log("\n5. Deleting Resume...");
  const deleteRes = await fetch(`${API_URL}/${resumeId}`, {
    method: "DELETE",
    headers
  });
  if (!deleteRes.ok) throw new Error(`Delete failed: ${deleteRes.statusText}`);
  console.log("Resume Deleted.");

  console.log("\nTest Flow Completed Successfully!");
}

testResumeFlow().catch(console.error);
