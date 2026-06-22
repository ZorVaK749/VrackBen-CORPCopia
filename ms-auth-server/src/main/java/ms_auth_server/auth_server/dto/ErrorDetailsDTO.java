package ms_auth_server.auth_server.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ErrorDetailsDTO {
    private LocalDateTime timestamp;
    private String message;
    private String details;
    private int status;
}
