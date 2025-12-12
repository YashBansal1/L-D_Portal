import { useEffect, useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import { UserService } from '../../services/userService';
import GlassCard from '../common/GlassCard';
import { Users, BookOpen, CheckCircle, AlertCircle } from 'lucide-react';

interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: string;
    department: string;
    progress: number;
}

const ManagerDashboard = () => {
    const { user } = useAppSelector(state => state.auth);
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTeam = async () => {
            if (user?.id) {
                const data = await UserService.getMyTeam(user.id);
                setTeam(data);
                setIsLoading(false);
            }
        };
        fetchTeam();
    }, [user?.id]);

    if (isLoading) return <div>Loading Team...</div>;

    const totalMembers = team.length;
    const avgProgress = team.reduce((acc, curr) => acc + curr.progress, 0) / totalMembers || 0;
    const atRisk = team.filter(m => m.progress < 50).length;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Manager Dashboard
            </h1>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassCard className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Total Team Members</p>
                        <p className="text-2xl font-bold">{totalMembers}</p>
                    </div>
                </GlassCard>
                <GlassCard className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg">
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Avg. Completion Rate</p>
                        <p className="text-2xl font-bold">{Math.round(avgProgress)}%</p>
                    </div>
                </GlassCard>
                <GlassCard className="flex items-center gap-4">
                    <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-lg">
                        <AlertCircle size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">At Risk (Low Progress)</p>
                        <p className="text-2xl font-bold text-red-600">{atRisk}</p>
                    </div>
                </GlassCard>
            </div>

            {/* Team List */}
            <div>
                <h2 className="text-xl font-bold mb-4">Team Performance</h2>
                <div className="grid gap-4">
                    {team.map(member => (
                        <GlassCard key={member.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                                    {member.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-semibold">{member.name}</h3>
                                    <p className="text-sm text-slate-500">{member.role} • {member.department}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 w-1/3">
                                <div className="flex-1">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span>Progress</span>
                                        <span className="font-medium">{member.progress}%</span>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${member.progress < 50 ? 'bg-red-500' : 'bg-green-500'}`}
                                            style={{ width: `${member.progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <button className="p-2 text-slate-400 hover:text-indigo-600">
                                    <BookOpen size={20} />
                                </button>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ManagerDashboard;
