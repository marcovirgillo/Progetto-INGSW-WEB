package com.cryptoview;
 
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.cryptoview.service.task.GainersTimer;
 
@SpringBootApplication
public class BackendApplication {
 
    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }
 
}