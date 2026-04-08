package com.safehaven;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.safehaven.model.ContactRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class SafehavenApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void contextLoads() {
        // Verifies the Spring context starts without errors.
    }

    @Test
    void hotlinesEndpointReturnsSeededData() throws Exception {
        mockMvc.perform(get("/api/hotlines"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(6));
    }

    @Test
    void contactSubmitReturns201() throws Exception {
        ContactRequest req = new ContactRequest();
        req.setName("Alex");
        req.setContactMethod("email");
        req.setContactInfo("alex@example.com");
        req.setMessage("I need help, please contact me.");

        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void contactSubmitWithEmptyMessageReturns400() throws Exception {
        ContactRequest req = new ContactRequest();
        req.setMessage("");

        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void adminGetContactEndpointDoesNotExist() throws Exception {
        // The GET /api/contact endpoint is intentionally removed to prevent
        // unauthenticated access to sensitive submission data.
        mockMvc.perform(get("/api/contact"))
                .andExpect(status().isMethodNotAllowed());
    }
}
