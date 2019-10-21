package com.example.spring.expense.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.spring.expense.model.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {
	
	Category findByName(String name);
}
