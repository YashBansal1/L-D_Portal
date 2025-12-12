

import EmployeeProfile from '../components/profile/EmployeeProfile';
import EmployeeDashboard from '../components/dashboard/EmployeeDashboard';

const Dashboard = () => {


    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3 space-y-8">
                    <EmployeeProfile />
                </div>
                <div className="md:w-2/3">
                    <EmployeeDashboard />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
