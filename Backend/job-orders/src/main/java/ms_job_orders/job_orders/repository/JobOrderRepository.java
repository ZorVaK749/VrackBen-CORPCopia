package ms_job_orders.job_orders.repository;

import ms_job_orders.job_orders.model.JobOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobOrderRepository extends JpaRepository<JobOrder, Long> {
    List<JobOrder> findByVehicleVin(String vehicleVin);
    List<JobOrder> findByStatus(String status);
}