package com.example.demo.exceptions;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
	 @ExceptionHandler(CustomException.class)
	    public ResponseEntity<?> handleCustomException(CustomException ex) {
	        Map<String, Object> error = new HashMap<>();
	        error.put("timestamp", LocalDateTime.now());
	        error.put("status", ex.getStatus().value());
	        error.put("error", ex.getStatus().getReasonPhrase());
	        error.put("message", ex.getMessage());
	        return new ResponseEntity<>(error, ex.getStatus());
	    }

}
