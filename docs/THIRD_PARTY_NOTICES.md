# Third-Party Notices and Licenses

This document contains the licenses and notices for third-party software used in Datacendia.

## Open Source Components

### Frontend Dependencies

| Package | Version | License | Description |
|---------|---------|---------|-------------|
| React | 18.x | MIT | UI framework |
| React Router | 6.x | MIT | Client-side routing |
| TailwindCSS | 3.x | MIT | Utility-first CSS framework |
| Vite | 7.x | MIT | Build tool & dev server |
| Zustand | 5.x | MIT | State management |
| i18next | 25.x | MIT | Internationalization |
| react-i18next | 16.x | MIT | React i18n integration |
| Framer Motion | 12.x | MIT | Animation library |
| Cytoscape.js | 3.x | MIT | Graph visualization |
| Lucide React | 0.x | ISC | Icon library |
| Radix UI | Various | MIT | Accessible UI primitives |
| MUI (Material UI) | 7.x | MIT | UI component library |
| clsx | 2.x | MIT | Class name utilities |
| Socket.io Client | 4.x | MIT | Real-time communication |
| Leaflet | 1.x | BSD-2 | Map visualization |

### Backend Dependencies

| Package | Version | License | Description |
|---------|---------|---------|-------------|
| Express | 4.x | MIT | Web framework |
| Prisma | 5.x | Apache-2.0 | ORM |
| pg | 8.x | MIT | PostgreSQL client |
| ioredis | 5.x | MIT | Redis client |
| neo4j-driver | 5.x | Apache-2.0 | Neo4j client |
| JOSE | Latest | MIT | JWT handling |
| bcryptjs | Latest | MIT | Password hashing |
| winston | 3.x | MIT | Logging |
| helmet | Latest | MIT | Security headers |
| cors | 2.x | MIT | CORS middleware |
| Zod | 3.x | MIT | Schema validation |
| Socket.io | 4.x | MIT | Real-time communication |
| Bull/BullMQ | 4.x/5.x | MIT | Job queue |
| Apollo Server | 5.x | MIT | GraphQL server |
| prom-client | Latest | Apache-2.0 | Prometheus metrics |

### AI/ML Components

| Package | Version | License | Description |
|---------|---------|---------|-------------|
| Ollama | Latest | MIT | Local LLM runtime |

### Infrastructure

| Package | Version | License | Description |
|---------|---------|---------|-------------|
| PostgreSQL | 16.x | PostgreSQL | Relational database |
| Redis | 7.x | BSD-3 | In-memory data store |
| Neo4j Enterprise | 5.x | Commercial* | Graph database |
| Docker | Latest | Apache-2.0 | Containerization |

*Neo4j Enterprise requires a commercial license for production use.

---

## AI Models

### Supported Models

Datacendia supports integration with the following AI models. **Customers may replace any model with their own fine-tuned versions.**

| Model | Provider | License | Use Case |
|-------|----------|---------|----------|
| Llama 3.1 | Meta | Llama 3 Community License | General reasoning |
| Mistral | Mistral AI | Apache-2.0 | Fast inference |
| CodeLlama | Meta | Llama 2 Community License | Code generation |
| Phi-3 | Microsoft | MIT | Compact reasoning |
| Gemma | Google | Gemma Terms of Use | General purpose |

### Model Replacement

Customers may replace any AI model used in Datacendia with their own fine-tuned models. To do so:

1. Deploy your model to Ollama: `ollama create my-model -f Modelfile`
2. Update the configuration: `OLLAMA_MODEL=my-model`
3. Restart the backend service

All model interactions are logged and can be audited.

---

## Full License Texts

### MIT License

```
MIT License

Copyright (c) [year] [copyright holders]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### Apache License 2.0

```
Apache License
Version 2.0, January 2004
http://www.apache.org/licenses/

TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

[Full Apache 2.0 license text available at http://www.apache.org/licenses/LICENSE-2.0]
```

### BSD 3-Clause License

```
BSD 3-Clause License

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its contributors
   may be used to endorse or promote products derived from this software without
   specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
```

---

## Commercial Components

The following components require separate commercial licenses for production use:

1. **Neo4j Enterprise** - Contact Neo4j for licensing
2. **Datacendia Platform** - See your license agreement

---

## Data Processing Addendum

For GDPR compliance, see our Data Processing Agreement (DPA) template at:
`/legal/dpa-template.pdf`

Standard Contractual Clauses (SCCs) are available upon request.

---

## Security Certifications

Datacendia is designed to meet the following compliance frameworks:

- SOC 2 Type II (in progress)
- GDPR
- HIPAA (with BAA)
- FedRAMP Moderate (roadmap)
- ISO 27001 (roadmap)

For the most current compliance status, contact: compliance@datacendia.com

---

## Contact

For licensing questions:
- Email: licensing@datacendia.com
- Legal: legal@datacendia.com

Last Updated: November 2024
