package com.onlinelearning.learning.controller;

import com.onlinelearning.learning.dto.RegisterRequest;
import com.onlinelearning.learning.entity.User;
import com.onlinelearning.learning.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Register User
    @PostMapping("/register")
    public User registerUser(@RequestBody RegisterRequest request) {
        return userService.registerUser(request);
    }

    // Get User by ID
    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    // Get All Users
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PutMapping("/users/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User user) {
        return userService.updateUser(id, user);
    }
}