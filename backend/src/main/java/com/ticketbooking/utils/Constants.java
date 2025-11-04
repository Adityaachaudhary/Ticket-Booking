package com.ticketbooking.utils;

public final class Constants {
    
    // File paths
    public static final String USERS_DATA_PATH = "data/users.json";
    public static final String TRAINS_DATA_PATH = "data/trains.json";
    public static final String BACKUP_USERS_PATH = "src/main/resources/data/users.json";
    public static final String BACKUP_TRAINS_PATH = "src/main/resources/data/trains.json";
    
    // Validation constants
    public static final int MIN_USERNAME_LENGTH = 3;
    public static final int MIN_PASSWORD_LENGTH = 6;
    public static final int SEAT_AVAILABLE = 0;
    public static final int SEAT_BOOKED = 1;
    
    // Messages
    public static final String USERNAME_TAKEN = "Username already taken!";
    public static final String INVALID_CREDENTIALS = "Invalid username or password!";
    public static final String LOGIN_SUCCESSFUL = "Login successful!";
    public static final String SIGNUP_SUCCESSFUL = "Sign up successful!";
    public static final String BOOKING_SUCCESSFUL = "Seat booked successfully!";
    public static final String BOOKING_CANCELLED = "Booking cancelled successfully!";
    
    private Constants() {
        // Utility class - prevent instantiation
    }
}