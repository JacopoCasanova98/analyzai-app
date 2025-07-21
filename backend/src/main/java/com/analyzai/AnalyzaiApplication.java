package com.analyzai;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {"com.analyzai"})
public class AnalyzaiApplication {

	public static void main(String[] args) {
		SpringApplication.run(AnalyzaiApplication.class, args);
	}

}
