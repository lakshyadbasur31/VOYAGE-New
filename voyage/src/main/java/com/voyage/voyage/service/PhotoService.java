package com.voyage.voyage.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@Service
public class PhotoService {

    private static final String UPLOAD_DIR = "uploads/";

    public void savePhoto(Long memoryId, MultipartFile photo) throws IOException {
        File dir = new File(UPLOAD_DIR + memoryId);
        if (!dir.exists()) {
            dir.mkdirs();
        }
        File dest = new File(dir, photo.getOriginalFilename());
        photo.transferTo(dest);
    }
}
