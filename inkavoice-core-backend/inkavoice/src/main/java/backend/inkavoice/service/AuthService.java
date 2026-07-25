package backend.inkavoice.service;

import backend.inkavoice.dto.AuthRequestDTO;
import backend.inkavoice.dto.AuthResponseDTO;
import backend.inkavoice.dto.GoogleTokenDTO;

public interface AuthService {
    AuthResponseDTO register(AuthRequestDTO request);
    AuthResponseDTO login(AuthRequestDTO request);
    AuthResponseDTO googleLogin(GoogleTokenDTO googleToken);
}
