# FlowAI

A node-based workflow automation platform that enables users to build custom automation workflows by connecting triggers to actions through a visual drag-and-drop interface.

## System Architecture

FlowAI follows a microservices-inspired architecture with clear separation between the frontend interface, backend API, background job processing, and database persistence.

### Data Flow

1. **Trigger Initiation**: Workflows begin with triggers such as webhooks, manual activation, or polled services (e.g., Gmail, Google Drive).
2. **Backend Processing**: The Express.js backend receives trigger events, validates them, and stores initial data.
3. **Inngest Orchestration**: Triggers are forwarded to Inngest for reliable background execution, ensuring scalability and fault tolerance.
4. **Node Execution**: Inngest processes the workflow graph, executing nodes in topological order using registered executors for each node type.
5. **Action Completion**: Results are persisted to MySQL and optionally sent to external services via webhooks or integrations.

```
Frontend (React) <--> Backend (Express) <--> Inngest <--> Database (MySQL)
     |                        |                |
     |                        |                |
   Zustand                 OAuth/API         Workflow
   State Mgmt              Endpoints         Execution
```

*Placeholder for Mermaid.js diagram*

## Key Features

- **Node-Based Editor**: Visual workflow builder using React Flow (@xyflow/react) for creating automation sequences
- **Multi-Provider OAuth**: Secure integration with Slack, GitHub, Google services (Drive, Gmail, Forms)
- **Dynamic HTTP Node**: Configurable HTTP requests with custom headers, methods, and payload mapping
- **AI Integration**: Built-in support for Gemini, Perplexity, and OpenAI APIs for intelligent workflow actions
- **Real-Time Monitoring**: Inngest Realtime for live workflow status updates
- **Background Processing**: Reliable execution via Inngest with automatic retries and failure handling
- **Execution Tracking**: Comprehensive logging of workflow runs with success/failure states

## Technology Stack

- **Frontend**: React.js (JavaScript), Vite, Tailwind CSS, Zustand (state management)
- **Backend**: Node.js, Express.js, Inngest (background jobs/queues)
- **Database**: MySQL
- **Authentication**: JWT with secure cookie-based sessions
- **Integrations**: OAuth 2.0 for third-party services

## Database Schema

The application uses MySQL with the following core tables:

- **users**: User accounts with authentication data
- **workflows**: Workflow definitions with metadata (name, status, trigger type)
- **workflow_graphs**: Node and edge definitions stored as JSON
- **workflow_triggers**: Polling configurations for time-based triggers
- **executions** (Runs): Execution history with status tracking, timestamps, and output data
- **integrations**: Connected third-party services per user
- **integration_accounts**: OAuth tokens and credentials storage
- **ai_integrations**: API keys for AI service providers

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- MySQL (v8+)
- Inngest account and CLI

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file (`.env`):
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=flowai
   JWT_SECRET=your_jwt_secret
   INNGEST_SIGNING_KEY=your_inngest_signing_key
   INNGEST_EVENT_KEY=your_inngest_event_key

   # OAuth Configuration
   SLACK_CLIENT_ID=your_slack_client_id
   SLACK_CLIENT_SECRET=your_slack_client_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret

 
   ```

4. Set up the database:
   - Create a MySQL database named `flowai`
   - Run the SQL schema from `FlowAI-Database.sql`

5. Start the development server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Inngest Development

For local Inngest development, run the Inngest CLI in a separate terminal:

```bash
npx inngest-cli@latest dev
```

## Usage

1. Access the frontend at `http://localhost:5173`
2. Create a user account and authenticate
3. Build workflows using the node-based editor
4. Connect integrations via OAuth
5. Test and deploy workflows

## Development Notes

- The frontend is implemented in standard JavaScript (ES6+), not TypeScript
- Workflows are executed asynchronously via Inngest to prevent blocking
- All database queries use parameterized statements for security
- Error handling includes automatic retries for transient failures

