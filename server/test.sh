#!/bin/bash
curl -X POST http://localhost:5001/api/interview/answer \
-H "Content-Type: application/json" \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YTQ2YWYxZmFiMmRmNDIzOGUxNTNjNTMiLCJpYXQiOjE3ODM1NDE2OTgsImV4cCI6MTc4NDE0NjQ5OH0.wZmFz65jsbHpQgJFzafdSDSkJV-ppCXqlDZPz3YrJJo" \
-d '{"sessionId": "6a4eafd7bcc40105e8cea578", "answer": "I am a final year IT student."}'