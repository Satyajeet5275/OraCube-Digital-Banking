package com.example.demo.service;

import com.example.demo.dto.AdminDecisionDTO;
import com.example.demo.entities.AccountRequest;
import java.util.List;

public interface AccountRequestService {
    List<AccountRequest> getAllRequests();
    
    void processRequest(Long requestId, AdminDecisionDTO decision);
}