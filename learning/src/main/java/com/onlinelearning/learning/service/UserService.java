package com.onlinelearning.learning.service;

import com.onlinelearning.learning.dto.RegisterRequest;
import com.onlinelearning.learning.entity.User;
import java.util.List;

public interface UserService {

    User registerUser(RegisterRequest request);

    User getUserById(Long id);

    List<User> getAllUsers();

    User updateUser(Long id, User user);
}