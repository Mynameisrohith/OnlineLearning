package com.onlinelearning.learning.serviceimpl;

import com.onlinelearning.learning.dto.RegisterRequest;
import com.onlinelearning.learning.entity.User;
import com.onlinelearning.learning.repository.UserRepository;
import com.onlinelearning.learning.service.UserService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User registerUser(RegisterRequest request) {

        // Check if email already exists
        userRepository.findByEmail(request.getEmail())
                .ifPresent(user -> {
                    throw new RuntimeException("Email already registered");
                });

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword()); // Later encode this
        user.setRole(request.getRole());

        return userRepository.save(user);
    }

    @Override
    public User getUserById(Long id) {

        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User updateUser(Long id, User user) {
        User existinguser=userRepository.findById(id).orElseThrow(()->new RuntimeException("user with"+id+"not found"));
        existinguser.setName(user.getName());
        existinguser.setEmail(user.getEmail());
        existinguser.setRole(user.getRole());
        existinguser.setPassword(user.getPassword());

       return  userRepository.save(existinguser);
    }
}