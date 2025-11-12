package com.ticketbooking.server;

import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;
import com.ticketbooking.services.UserBookingService;
import com.ticketbooking.services.TrainService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ticketbooking.entities.User;
import com.ticketbooking.entities.Train;

import java.io.*;
import java.net.InetSocketAddress;
import java.util.*;

public class SimpleHttpServer {
    private static final ObjectMapper mapper = new ObjectMapper();
    private static UserBookingService userService;
    private static TrainService trainService;
    
    static {
        try {
            userService = new UserBookingService();
            trainService = new TrainService();
        } catch (IOException e) {
            System.err.println("Failed to initialize services: " + e.getMessage());
            System.exit(1);
        }
    }

    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        
        server.createContext("/api/login", new LoginHandler());
        server.createContext("/api/signup", new SignupHandler());
        server.createContext("/api/trains/search", new TrainSearchHandler());
        server.createContext("/api/book", new BookingHandler());
        server.createContext("/api/bookings", new BookingsHandler());
        server.createContext("/api/cancel", new CancelHandler());
        
        server.setExecutor(null);
        server.start();
        System.out.println("🚀 Server started on http://localhost:8080");
        System.out.println("📱 Frontend should connect to this server");
    }

    static class LoginHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            addCorsHeaders(exchange);
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(200, 0);
                exchange.close();
                return;
            }
            if ("POST".equals(exchange.getRequestMethod())) {
                String body = new String(exchange.getRequestBody().readAllBytes());
                Map<String, String> request = mapper.readValue(body, Map.class);
                
                User user = userService.authenticateUser(request.get("username"), request.get("password"));
                Map<String, Object> response = new HashMap<>();
                
                if (user != null) {
                    response.put("success", true);
                    response.put("user", Map.of("userId", user.getUserId(), "username", user.getUsername()));
                } else {
                    response.put("success", false);
                    response.put("message", "Invalid credentials");
                }
                
                String jsonResponse = mapper.writeValueAsString(response);
                exchange.sendResponseHeaders(200, jsonResponse.length());
                exchange.getResponseBody().write(jsonResponse.getBytes());
            }
            exchange.close();
        }
    }

    static class SignupHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            addCorsHeaders(exchange);
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(200, 0);
                exchange.close();
                return;
            }
            if ("POST".equals(exchange.getRequestMethod())) {
                String body = new String(exchange.getRequestBody().readAllBytes());
                Map<String, String> request = mapper.readValue(body, Map.class);
                
                boolean success = userService.signUpUser(request.get("username"), request.get("password"));
                Map<String, Object> response = Map.of("success", success, "message", success ? "Signup successful" : "Username already exists");
                
                String jsonResponse = mapper.writeValueAsString(response);
                exchange.sendResponseHeaders(200, jsonResponse.length());
                exchange.getResponseBody().write(jsonResponse.getBytes());
            }
            exchange.close();
        }
    }

    static class TrainSearchHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            addCorsHeaders(exchange);
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(200, 0);
                exchange.close();
                return;
            }
            if ("GET".equals(exchange.getRequestMethod())) {
                String query = exchange.getRequestURI().getQuery();
                String source = "", destination = "";
                
                if (query != null) {
                    String[] params = query.split("&");
                    for (String param : params) {
                        String[] keyValue = param.split("=");
                        if (keyValue.length == 2) {
                            if ("source".equals(keyValue[0])) source = keyValue[1];
                            if ("destination".equals(keyValue[0])) destination = keyValue[1];
                        }
                    }
                }
                
                List<Train> trains = trainService.searchTrains(source, destination);
                Map<String, Object> response = Map.of("success", true, "trains", trains);
                
                String jsonResponse = mapper.writeValueAsString(response);
                exchange.sendResponseHeaders(200, jsonResponse.length());
                exchange.getResponseBody().write(jsonResponse.getBytes());
            }
            exchange.close();
        }
    }

    static class BookingHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            addCorsHeaders(exchange);
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(200, 0);
                exchange.close();
                return;
            }
            if ("POST".equals(exchange.getRequestMethod())) {
                try {
                    String body = new String(exchange.getRequestBody().readAllBytes());
                    Map<String, Object> request = mapper.readValue(body, Map.class);
                    
                    String trainId = (String) request.get("trainId");
                    String userId = (String) request.get("userId");
                    Object rowObj = request.get("row");
                    Object colObj = request.get("col");
                    
                    if (trainId == null || userId == null || rowObj == null || colObj == null) {
                        Map<String, Object> errorResponse = Map.of("success", false, "message", "Missing required parameters");
                        String jsonResponse = mapper.writeValueAsString(errorResponse);
                        exchange.sendResponseHeaders(400, jsonResponse.length());
                        exchange.getResponseBody().write(jsonResponse.getBytes());
                        exchange.close();
                        return;
                    }
                    
                    int row = (rowObj instanceof Integer) ? (Integer) rowObj : Integer.parseInt(rowObj.toString());
                    int col = (colObj instanceof Integer) ? (Integer) colObj : Integer.parseInt(colObj.toString());
                    
                    Map<String, Object> result = userService.bookSeat(trainId, userId, row, col);
                    
                    String jsonResponse = mapper.writeValueAsString(result);
                    exchange.sendResponseHeaders(200, jsonResponse.length());
                    exchange.getResponseBody().write(jsonResponse.getBytes());
                } catch (Exception e) {
                    Map<String, Object> errorResponse = Map.of("success", false, "message", "Booking failed: " + e.getMessage());
                    String jsonResponse = mapper.writeValueAsString(errorResponse);
                    exchange.sendResponseHeaders(500, jsonResponse.length());
                    exchange.getResponseBody().write(jsonResponse.getBytes());
                }
            }
            exchange.close();
        }
    }

    static class BookingsHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            addCorsHeaders(exchange);
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(200, 0);
                exchange.close();
                return;
            }
            if ("GET".equals(exchange.getRequestMethod())) {
                String query = exchange.getRequestURI().getQuery();
                String userId = "";
                
                if (query != null && query.startsWith("userId=")) {
                    userId = query.substring(7);
                }
                
                List<Map<String, Object>> bookings = userService.getUserBookings(userId);
                Map<String, Object> response = Map.of("success", true, "bookings", bookings);
                
                String jsonResponse = mapper.writeValueAsString(response);
                exchange.sendResponseHeaders(200, jsonResponse.length());
                exchange.getResponseBody().write(jsonResponse.getBytes());
            }
            exchange.close();
        }
    }

    static class CancelHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            addCorsHeaders(exchange);
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(200, 0);
                exchange.close();
                return;
            }
            if ("POST".equals(exchange.getRequestMethod())) {
                String body = new String(exchange.getRequestBody().readAllBytes());
                Map<String, String> request = mapper.readValue(body, Map.class);
                
                boolean success = userService.cancelBooking(request.get("ticketId"), request.get("userId"));
                Map<String, Object> response = Map.of("success", success, "message", success ? "Booking cancelled" : "Booking not found");
                
                String jsonResponse = mapper.writeValueAsString(response);
                exchange.sendResponseHeaders(200, jsonResponse.length());
                exchange.getResponseBody().write(jsonResponse.getBytes());
            }
            exchange.close();
        }
    }

    private static void addCorsHeaders(HttpExchange exchange) {
        exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "http://localhost:3000");
        exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");
    }
}