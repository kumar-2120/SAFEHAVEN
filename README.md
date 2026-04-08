# 🏠 SAFEHAVEN – Against Domestic Violence

SAFEHAVEN is an awareness and resource web application dedicated to the fight against domestic violence.  
It consists of a **static HTML/CSS/JS frontend** and a **Spring Boot REST API backend**.

## Features

- **Quick-exit button** – instantly navigates away from the page and replaces browser history so survivors can browse safely.
- **ESC × 3 shortcut** – pressing Escape three times in quick succession triggers the same safe exit.
- **Awareness content** – explains types of domestic violence and key statistics.
- **Warning signs** – helps visitors recognise abusive situations.
- **Crisis hotlines** – national and international helplines with direct tel: links, served from the backend API.
- **Steps to safety** – a clear, step-by-step guide from recognition to recovery.
- **Confidential contact form** – visitors can reach out; submissions are stored via the Spring Boot backend.

---

## Running the backend (Spring Boot / Spring Tool Suite)

### Prerequisites
- Java 17+
- Maven 3.6+ (or use the Maven wrapper once available)

### In Spring Tool Suite (STS)
1. Open STS → **File → Import → Maven → Existing Maven Projects**.
2. Browse to the `safehaven-backend/` folder and click **Finish**.
3. Right-click the project → **Run As → Spring Boot App**.
4. The API starts on **http://localhost:8080**.

### From the command line
```bash
cd safehaven-backend
mvn spring-boot:run
```

### API endpoints

| Method | URL | Description |
|--------|-----|-------------|
| `POST` | `/api/contact` | Submit a help-request form |
| `GET`  | `/api/contact` | List all submissions (admin) |
| `GET`  | `/api/hotlines` | Get all crisis hotlines |
| `GET`  | `/api/hotlines?region=USA` | Filter hotlines by region |

The H2 in-memory database console is available at **http://localhost:8080/h2-console**  
(JDBC URL: `jdbc:h2:mem:safehavendb`, user: `sa`, password: *(blank)*).

---

## Running the frontend

Open `index.html` in any modern web browser **after** the backend is running:

```bash
open index.html          # macOS
xdg-open index.html      # Linux
start index.html         # Windows
```

Or serve with a static file server:

```bash
npx serve .
```

---

## File structure

```
SAFEHAVEN/
├── index.html                          # Frontend – main page
├── styles.css                          # Frontend – stylesheet
├── script.js                           # Frontend – quick-exit, API calls, smooth scroll
├── README.md
└── safehaven-backend/                  # Spring Boot backend
    ├── pom.xml
    └── src/main/java/com/safehaven/
        ├── SafehavenApplication.java
        ├── config/
        │   ├── CorsConfig.java
        │   └── GlobalExceptionHandler.java
        ├── controller/
        │   ├── ContactController.java
        │   └── ResourceController.java
        ├── model/
        │   ├── ApiResponse.java
        │   ├── ContactRequest.java
        │   ├── ContactSubmission.java
        │   └── Hotline.java
        ├── repository/
        │   ├── ContactRepository.java
        │   └── HotlineRepository.java
        └── service/
            ├── ContactService.java
            └── ResourceService.java
```

---

## Resources

| Organisation | Contact |
|---|---|
| National DV Hotline (USA) | 1-800-799-7233 |
| Crisis Text Line (USA) | Text HOME to 741741 |
| National DV Helpline (UK) | 0808 2000 247 |
| Emergency Services | 911 / 999 / 112 |
| International directory | [hotpeachpages.net](https://www.hotpeachpages.net/) |

---

> *"No one should live in fear at home."*