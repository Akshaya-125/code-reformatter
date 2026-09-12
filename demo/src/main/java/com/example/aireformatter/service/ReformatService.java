package com.example.aireformatter.service;

import com.example.aireformatter.dto.ReformatRequest;
import com.example.aireformatter.dto.ReformatResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.http.*;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

@Service
public class ReformatService {

    @Value("${django.ai.service.url}")
    private String djangoUrl;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public ReformatResponse reformat(ReformatRequest request) throws Exception {

        // Use SimpleClientHttpRequestFactory to avoid chunked encoding
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setBufferRequestBody(true);
        RestTemplate restTemplate = new RestTemplate(factory);

        // Serialize request to JSON string manually
        String jsonBody = objectMapper.writeValueAsString(request);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setContentLength(jsonBody.getBytes().length);

        HttpEntity<String> entity = new HttpEntity<>(jsonBody, headers);

        ResponseEntity<String> rawResponse = restTemplate.exchange(
            djangoUrl,
            HttpMethod.POST,
            entity,
            String.class
        );

        return objectMapper.readValue(rawResponse.getBody(), ReformatResponse.class);
    }
}