package com.example.aireformatter.repository;

import com.example.aireformatter.model.ReformatHistory;
import com.example.aireformatter.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HistoryRepository extends JpaRepository<ReformatHistory, Long> {
    List<ReformatHistory> findByUserOrderByCreatedAtDesc(User user);
}