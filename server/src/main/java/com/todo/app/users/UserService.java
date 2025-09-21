package com.todo.app.users;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.todo.app.users.model.UserCreateRequest;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	public User createUser(UserCreateRequest user) {
		User entity = User.builder()
			.email(user.getEmail())
			.username(user.getUsername())
			.password(passwordEncoder.encode(user.getPassword()))
			.firstName(user.getFirstName())
			.lastName(user.getLastName())
			.build();
		return userRepository.save(entity);
	}

	public User authenticate(String usernameOrEmail, String rawPassword) {
		return userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail)
			.filter(u -> passwordEncoder.matches(rawPassword, u.getPassword()))
			.orElse(null);
	}

	public boolean existsByUsernameOrEmail(String username, String email) {
		return userRepository.existsByUsernameOrEmail(username, email);
	}
}

