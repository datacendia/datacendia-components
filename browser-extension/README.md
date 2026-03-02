# CendiaGateway Browser Extension

Chrome/Edge Manifest V3 extension that routes all AI API traffic through CendiaGateway for governance, PII detection, policy enforcement, and cryptographic audit trails.

## What It Does

When installed, the extension intercepts HTTP requests to AI provider APIs and redirects them through your CendiaGateway instance. Employees use ChatGPT, Claude, Gemini, etc. exactly as before — the extension is transparent.

**Supported Providers:**
- OpenAI (`api.openai.com`)
- Anthropic (`api.anthropic.com`)
- Google AI (`generativelanguage.googleapis.com`)
- Mistral AI (`api.mistral.ai`)
- Groq (`api.groq.com`)
- Azure OpenAI (`*.openai.azure.com`)

## Installation

### Development / Testing

1. Open Chrome → `chrome://extensions/`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked**
4. Select this `browser-extension/` directory
5. The CendiaGateway shield icon appears in your toolbar

### Enterprise Deployment

Distribute via:
- **Chrome Enterprise policy** (`ExtensionInstallForcelist`)
- **Microsoft Intune** for Edge
- **Google Workspace Admin** for managed Chrome

## Configuration

Click the extension icon → **Settings**, or right-click → **Options**.

| Setting | Description |
|---|---|
| **Gateway URL** | Your CendiaGateway API endpoint (e.g., `https://gateway.company.com`) |
| **Email** | Your corporate email for audit attribution |
| **Department** | Your department for policy scoping |
| **Organization ID** | Provided by your IT admin |

## How It Works

1. Extension uses `declarativeNetRequest` to redirect AI API calls to your gateway
2. Gateway performs PII scanning, policy enforcement, and DCII signing
3. Gateway forwards the cleaned request to the actual AI provider
4. Response flows back through the gateway to the browser
5. Every interaction is logged to the immutable audit ledger

## Generating Icons

Chrome requires PNG icons at 16×16, 48×48, and 128×128 pixels. An SVG source and an HTML generator are included:

1. Open `generate-icons.html` in Chrome
2. Click the three **Download** buttons to save `icon16.png`, `icon48.png`, `icon128.png`
3. Move them into the `icons/` directory
4. Reload the extension in `chrome://extensions`

> **The extension will not load without real PNG icons.** The SVG in `icons/icon.svg` is the source artwork only — Chrome Manifest V3 does not accept SVG icons.

## Limitations

- Only intercepts API-level requests (programmatic tools, extensions using AI APIs)
- Web-based ChatGPT UI uses its own session cookies — the extension redirects the API calls but ChatGPT's frontend may not work through a proxy without additional configuration
- Personal devices on personal networks are outside scope (corporate policy boundary)
