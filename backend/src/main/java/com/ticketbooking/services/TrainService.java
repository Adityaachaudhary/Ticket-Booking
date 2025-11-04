package com.ticketbooking.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.ticketbooking.entities.Train;

import java.io.File;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

public class TrainService {

    private List<Train> trainList;
    private final ObjectMapper objectMapper;
    private static final String TRAIN_DB_PATH = "data/trains.json";
    private static final String BACKUP_TRAIN_DB_PATH = "src/main/resources/data/trains.json";

    public TrainService() throws IOException{
        objectMapper = new ObjectMapper();
        objectMapper.enable(SerializationFeature.INDENT_OUTPUT);
        loadTrains();
    }

    public void loadTrains() throws IOException{
        try {
            // Try to load from classpath first (for packaged JAR)
            var resource = getClass().getClassLoader().getResourceAsStream(TRAIN_DB_PATH);
            if (resource != null) {
                trainList = objectMapper.readValue(resource, new TypeReference<List<Train>>() {});
            } else {
                // Fallback to file system (for development)
                trainList = objectMapper.readValue(new File(BACKUP_TRAIN_DB_PATH), new TypeReference<List<Train>>() {});
            }
        } catch (Exception e) {
            throw new IOException("Failed to load trains data: " + e.getMessage(), e);
        }
    }

    public List<Train> searchTrains(String source, String destination){
        if (source == null || destination == null || source.trim().isEmpty() || destination.trim().isEmpty()) {
            return Collections.emptyList();
        }
        
        try{
            return trainList.stream()
                    .filter(train -> validTrain(train, source.toLowerCase().trim(), destination.toLowerCase().trim()))
                    .collect(Collectors.toList());
        }catch (Exception ex){
            System.err.println("Error in searchTrains: " + ex.getMessage());
            return Collections.emptyList();
        }
    }

    public void addTrain(Train newTrain) {
        Optional<Train> existingTrain = trainList.stream()
                .filter(train -> train.getTrainId().equalsIgnoreCase(newTrain.getTrainId()))
                .findFirst();

        if (existingTrain.isPresent()) {
            updateTrain(newTrain);
        } else {
            trainList.add(newTrain);
            saveTrainListToFile();
        }
    }

    private void saveTrainListToFile() {
        try {
            // Always save to backup path for development
            objectMapper.writeValue(new File(BACKUP_TRAIN_DB_PATH), trainList);
        } catch (IOException e) {
            System.err.println("Failed to save train list to file: " + e.getMessage());
        }
    }

    public void updateTrain(Train updatedTrain) {
        OptionalInt index = IntStream.range(0, trainList.size())
                .filter(i -> trainList.get(i).getTrainId().equalsIgnoreCase(updatedTrain.getTrainId()))
                .findFirst();

        if (index.isPresent()) {
            trainList.set(index.getAsInt(), updatedTrain);
            saveTrainListToFile();
        } else {
            addTrain(updatedTrain);
        }
    }
    
    private boolean validTrain(Train train, String source, String destination) {
        List<String> stationList = train.getStations();
        int sourceIndex = stationList.indexOf(source);
        int destinationIndex = stationList.indexOf(destination);

        try{
            return  sourceIndex != -1
                    && destinationIndex != -1
                    && sourceIndex < destinationIndex;
        }catch (Exception e){
            System.out.println("Error in validTrain: " + e.getMessage());
            return false;
        }
    }

    public boolean bookTickets(Train train, int row, int seat) {
        List<List<Integer>> seats = train.getSeats();
        try{
            if (row >= 0 && row < seats.size() && seat >= 0 && seat < seats.get(row).size()) {
                if (seats.get(row).get(seat) == 0) {
                    seats.get(row).set(seat, 1);
                    train.setSeats(seats);
                    addTrain(train);
                    return true;
                }
            }
            return false;
        }catch (Exception e){
            System.out.println("Error in bookTickets: " + e.getMessage());
            return false;
        }
    }
}