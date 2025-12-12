import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { UserService } from '../../services/userService';
import { fetchUserProgress, fetchTrainings } from '../../store/trainingSlice';
import type { EmployeeProfile as IEmployeeProfile } from '../../types';
import { Award, BookOpen, Clock, Code2, FileText } from 'lucide-react';
import GlassCard from '../common/GlassCard';
import CertificateModal from '../common/CertificateModal';

const EmployeeProfile = () => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const { userProgress, list: trainings } = useAppSelector((state) => state.trainings);
    const [profile, setProfile] = useState<IEmployeeProfile | null>(null);
    const [viewCertificate, setViewCertificate] = useState<{ course: string, date: string, duration: number } | null>(null);

    useEffect(() => {
        if (user?.id) {
            UserService.getProfile(user.id).then(setProfile);
            dispatch(fetchUserProgress(user.id));
            dispatch(fetchTrainings());
        }
    }, [user?.id, dispatch]);

    if (!profile) return <div>Loading Profile...</div>;

    // Derive completed trainings from real progress state
    const completedTrainings = userProgress
        .filter(p => p.status === 'completed')
        .map(p => {
            const training = trainings.find(t => t.id === p.trainingId);
            return training ? {
                ...training,
                completedAt: p.completedAt || new Date().toISOString()
            } : null;
        })
        .filter((t): t is NonNullable<typeof t> => t !== null);

    return (
        <div className="space-y-6">
            <GlassCard className="flex items-center gap-6 border-l-4 border-l-indigo-600">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {profile.name.charAt(0)}
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{profile.name}</h2>
                    <p className="text-slate-500 dark:text-slate-400">{profile.role} • {profile.department}</p>
                    <div className="flex gap-4 mt-2">
                        <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                            <Clock size={16} className="mr-1 text-indigo-500" />
                            <span>{profile.totalLearningHours}h Learning</span>
                        </div>
                        <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                            <Award size={16} className="mr-1 text-yellow-500" />
                            <span>{profile.badges?.length || 0} Badges</span>
                        </div>
                    </div>
                </div>
            </GlassCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                            <Code2 size={20} />
                        </div>
                        <h3 className="font-bold text-lg">Skills</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {profile.skills.map(skill => (
                            <span key={skill} className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-sm hover:bg-slate-200 transition-colors">
                                {skill}
                            </span>
                        ))}
                    </div>
                </GlassCard>

                <GlassCard>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                            <BookOpen size={20} />
                        </div>
                        <h3 className="font-bold text-lg">Completed Certifications</h3>
                    </div>
                    {completedTrainings.length > 0 ? (
                        <ul className="space-y-3">
                            {completedTrainings.map(cert => (
                                <li key={cert.id} className="flex flex-col gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg transition-colors border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900">
                                    <div className="flex items-start gap-2 text-sm font-medium">
                                        <div className="w-2 h-2 rounded-full bg-green-500 shrink-0 mt-1.5"></div>
                                        <span className="leading-snug text-slate-700 dark:text-slate-200">{cert.title}</span>
                                    </div>
                                    <button
                                        onClick={() => setViewCertificate({
                                            course: cert.title,
                                            date: cert.completedAt,
                                            duration: cert.durationHours
                                        })}
                                        className="self-start shrink-0 text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-800 px-3 py-1.5 bg-white dark:bg-slate-800 border border-indigo-100 dark:border-indigo-900/50 rounded-md shadow-sm hover:shadow transition-all"
                                    >
                                        <FileText size={14} /> Certificate
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-slate-400">No certifications yet. Complete a training!</p>
                    )}
                </GlassCard>
            </div>

            {viewCertificate && (
                <CertificateModal
                    userName={profile.name}
                    courseName={viewCertificate.course}
                    completedAt={viewCertificate.date}
                    duration={viewCertificate.duration}
                    onClose={() => setViewCertificate(null)}
                />
            )}

            {profile.badges && profile.badges.length > 0 && (
                <GlassCard>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
                            <Award size={20} />
                        </div>
                        <h3 className="font-bold text-lg">Badges</h3>
                    </div>
                    <div className="flex gap-4">
                        {profile.badges.map(badge => (
                            <div key={badge.id} className="text-center group">
                                <div className="w-16 h-16 rounded-full bg-yellow-50 border-2 border-yellow-200 flex items-center justify-center text-2xl mb-2 group-hover:scale-110 transition-transform shadow-sm">
                                    🏅
                                </div>
                                <p className="text-xs font-medium">{badge.name}</p>
                            </div>
                        ))}
                    </div>
                </GlassCard>
            )}
        </div>
    );
};

export default EmployeeProfile;
