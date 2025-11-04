package com.ticketbooking.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.ticketbooking.entities.Ticket;
import com.ticketbooking.entities.Train;
import com.ticketbooking.entities.User;
import com.ticketbooking.utils.UserServiceUtil;

import java.io.File;
import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

public class UserBookingService {

    private User user;
    private List<User> userList;
    private final ObjectMapper objectMapper;
    private static final String USERS_PATH = "data/users.json";
    private static final String BACKUP_USERS_PATH = "src/main/resources/data/users.json";

    public UserBookingService() throws IOException{
        objectMapper = new ObjectMapper();
        objectMapper.enable(SerializationFeature.INDENT_OUTPUT);
        loadUsers();
    }
    
    private void loadUsers() throws IOException{
        try {
            // Try to load from classpath first (for packaged JAR)
            var resource = getClass().getClassLoader().getResourceAsStream(USERS_PATH);
            if (resource != null) {
                userList = objectMapper.readValue(resource, new TypeReference<List<User>>() {});
            } else {
                // Fallback to file system (for development)
                userList = objectMapper.readValue(new File(BACKUP_USERS_PATH), new TypeReference<List<User>>() {});
            }
        } catch (Exception e) {
            throw new IOException("Failed to load users data: " + e.getMessage(), e);
        }
    }

    public boolean signUp(User user) throws IOException{
        if (user == null || user.getUsername() == null || user.getUsername().trim().isEmpty()) {
            System.out.println("Invalid user data!");
            return false;
        }
        
        try{
            Optional<User> foundUser = userList.stream()
                    .filter(existingUser -> existingUser.getUsername().equalsIgnoreCase(user.getUsername().trim()))
                    .findFirst();

            if (foundUser.isPresent()) {
                System.out.println("Username already taken!");
                return false;
            }

            userList.add(user);
            saveUserListToFile();
        }catch (Exception ex){
            System.err.println("Saving user list to file failed: " + ex.getMessage());
            return false;
        }
        return true;
    }

    private void saveUserListToFile() throws IOException{
        // Always save to backup path for development
        File usersFile = new File(BACKUP_USERS_PATH);
        objectMapper.writeValue(usersFile, userList);
    }

    public void fetchBookings(){
        System.out.println("Fetching your bookings");
        user.printTickets();
    }

    public Optional<User> getUserByUsername(String username){
        return userList.stream().filter(user -> user.getUsername().equals(username)).findFirst();
    }

    public void setUser(User user){
        this.user = user;
    }

    public boolean cancelBooking(String ticketId) throws IOException{
        if (user == null) {
            System.out.println("No user logged in!");
            return false;
        }
        
        if (ticketId == null || ticketId.trim().isEmpty()) {
            System.out.println("Ticket ID cannot be null or empty.");
            return false;
        }
        
        boolean isRemoved = user.getTicketsBooked().removeIf(ticket -> ticket.getTicketId().equals(ticketId.trim()));
        if(isRemoved) {
            saveUserListToFile();
            System.out.println("Ticket with ID " + ticketId + " has been canceled.");
            return true;
        }else{
            System.out.println("No ticket found with ID " + ticketId);
            return false;
        }
    }

    public List<Train> getTrains (String source, String destination) throws IOException {
        try{
            TrainService trainService = new TrainService();
            return trainService.searchTrains(source,destination);
        }catch (Exception ex){
            System.out.println("There is something wrong!");
            return Collections.emptyList();
        }
    }

    public List<List<Integer>> fetchSeats(Train train){
        return train.getSeats();
    }

    public Boolean bookTrainSeat(Train train, int row, int seat) {
        try{
            TrainService trainService = new TrainService();
            List<List<Integer>> seats = train.getSeats();
            if (row >= 0 && row < seats.size() && seat >= 0 && seat < seats.get(row).size()) {
                if (seats.get(row).get(seat) == 0) {
                    seats.get(row).set(seat, 1);

                    train.setSeats(seats);
                    trainService.addTrain(train);

                    Ticket ticket = new Ticket();

                    ticket.setSource(train.getStations().get(0));
                    ticket.setDestination(train.getStations().get(train.getStations().size() - 1));
                    ticket.setTrain(train);
                    ticket.setUserId(user.getUserId());
                    ticket.setDateOfTravel(java.time.LocalDate.now().toString());
                    ticket.setTicketId(UserServiceUtil.generateTicketId());

                    user.getTicketsBooked().add(ticket);

                    System.out.println("Seat booked successfully  !  ");
                    System.out.println(ticket.getTicketInfo());

                    saveUserListToFile();
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }catch (IOException ex){
            return Boolean.FALSE;
        }
    }
}