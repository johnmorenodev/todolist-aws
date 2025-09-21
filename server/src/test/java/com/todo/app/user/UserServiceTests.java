package com.todo.app.user;

import java.util.Optional;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.crypto.password.PasswordEncoder;

public class UserServiceTests {
    private  UserService userService;
    private  UserRepository userRepository;
    private  PasswordEncoder passwordEncoder;

    @BeforeEach
    public void setUp() {
        userRepository = Mockito.mock(UserRepository.class);
        passwordEncoder = Mockito.mock(PasswordEncoder.class);
        userService = new UserService(userRepository, passwordEncoder);
    }

    @Test
    public void authenticate_ShouldReturnPresentUser_WhenUsernameAndPasswordAreCorrect() {
        User user = new User();
        user.setUsername("johndoe");
        user.setPassword("password");

        Mockito.when(userRepository.findByUsernameOrEmail("johndoe", "johndoe")).thenReturn(Optional.of(user));
        Mockito.when(passwordEncoder.matches("password", "password")).thenReturn(true);
        Optional<User> result = userService.authenticate("johndoe", "password");
        Assertions.assertTrue(result.isPresent());
        Assertions.assertEquals(user, result.get());
    }

    @Test
    public void authenticate_ShouldReturnEmptyOptional_WhenUsernameIsIncorrect() {
        Mockito.when(userRepository.findByUsernameOrEmail("notJohnDoe", "notJohnDoe")).thenReturn(Optional.empty());
        Mockito.when(passwordEncoder.matches("password", "password")).thenReturn(true);
        Optional<User> result = userService.authenticate("notJohnDoe", "password");
        Assertions.assertTrue(result.isEmpty());
    }

    @Test
    public void authenticate_ShouldReturnEmptyOptional_WhenEmailIsIncorrect() {
        Mockito.when(userRepository.findByUsernameOrEmail("notJohnDoe", "notJohnDoe@example.com")).thenReturn(Optional.empty());
        Mockito.when(passwordEncoder.matches("password", "password")).thenReturn(true);
        Optional<User> result = userService.authenticate("notJohnDoe@example.com", "password");
        Assertions.assertTrue(result.isEmpty());
    }

    @Test
    public void authenticate_ShouldReturnPresentUser_WhenEmailIsCorrect() {
        User user = new User();
        user.setEmail("johndoe@example.com");
        user.setPassword("password");

        Mockito.when(userRepository.findByUsernameOrEmail("johndoe@example.com", "johndoe@example.com")).thenReturn(Optional.of(user));
        Mockito.when(passwordEncoder.matches("password", "password")).thenReturn(true);
        Optional<User> result = userService.authenticate("johndoe@example.com", "password");
        Assertions.assertTrue(result.isPresent());
        Assertions.assertEquals(user, result.get());
    }

    @Test
    public void authenticate_ShouldReturnEmptyOptional_WhenPasswordIsIncorrect() {
        User user = new User();
        user.setUsername("johndoe");
        user.setPassword("password");

        Mockito.when(userRepository.findByUsernameOrEmail("johndoe", "johndoe")).thenReturn(Optional.of(user));
        Mockito.when(passwordEncoder.matches("wrongPassword", "password")).thenReturn(false);
        Optional<User> result = userService.authenticate("johndoe", "wrongPassword");
        Assertions.assertTrue(result.isEmpty());
    }
}
