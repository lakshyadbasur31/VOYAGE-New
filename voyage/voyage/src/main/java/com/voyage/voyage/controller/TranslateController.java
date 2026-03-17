package com.voyage.voyage.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/translator")
@CrossOrigin(origins = "*")
public class TranslateController {

    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping
    public Map<String, String> translatorMap(@RequestBody Map<String, String> body) {

        String text = body.get("text");
        String source = body.get("source");   // "auto"
        String target = body.get("target");   // "fr", "en", etc.

        Map<String, String> result = new HashMap<>();

        try {
            String url = "https://api.mymemory.translated.net/get?q="
                    + URLEncoder.encode(text, StandardCharsets.UTF_8)
                    + "&langpair=" + (source.equals("auto") ? "auto" : source)
                    + "|" + target;

            Map response = restTemplate.getForObject(url, Map.class);

            Map responseData = (Map) response.get("responseData");
            String translated = (String) responseData.get("translatedText");

            // ✅ CRITICAL FIX — decode UTF-8 response
            translated = URLDecoder.decode(translated, StandardCharsets.UTF_8);

            // ✅ detect language correctly
            String detectedLang = source.equals("auto")
                    ? (String) response.get("sourceLanguage")
                    : source;

            result.put("translatedText", translated);
            result.put("detectedLanguage", detectedLang);

        } catch (Exception e) {
            e.printStackTrace();
            result.put("translatedText", "Translation failed");
            result.put("detectedLanguage", "unknown");
        }

        return result;
    }
}
