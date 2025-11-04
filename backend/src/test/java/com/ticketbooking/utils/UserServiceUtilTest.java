package com.ticketbooking.utils;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class UserServiceUtilTest {

    @Test
    void testHashPassword() {
        String password = "testPassword123";
        String hashedPassword = UserServiceUtil.hashPassword(password);
        
        assertNotNull(hashedPassword);
        assertNotEquals(password, hashedPassword);
        assertTrue(hashedPassword.startsWith("$2a$"));
    }

    @Test
    void testCheckPassword() {
        String password = "testPassword123";
        String hashedPassword = UserServiceUtil.hashPassword(password);
        
        assertTrue(UserServiceUtil.checkPassword(password, hashedPassword));
        assertFalse(UserServiceUtil.checkPassword("wrongPassword", hashedPassword));
    }

    @Test
    void testGenerateTicketId() {
        String ticketId1 = UserServiceUtil.generateTicketId();
        String ticketId2 = UserServiceUtil.generateTicketId();
        
        assertNotNull(ticketId1);
        assertNotNull(ticketId2);
        assertNotEquals(ticketId1, ticketId2);
    }
}