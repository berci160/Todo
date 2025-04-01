import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

import { ActivityLogProps, clearActivityLog, getActivityLog } from 'services/activity.logger.service';

const ActivityLogger = () => {
  const [Activitylogs, setActivitylogs] = useState<ActivityLogProps[]>([]);

  const { t } = useTranslation();

  useEffect(() => {
    setActivitylogs(getActivityLog());
  }, []);

  const handleClearActivityLogs = () => {
    clearActivityLog();
    setActivitylogs([]);
  };

  return (
    <div>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-center">{t('activity_log')}</h1>

        {Activitylogs.length === 0 ? (
          <p className="text-gray-600 text-center">{t('no_activity_log')}</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Activitylogs.map(({ id, type, userName, timestamp }) => (
              <li key={id} className="p-4 border rounded shadow-sm bg-lime-100">
                <div>
                  <span className="font-semibold">{t('event')} </span>
                  {type}
                </div>
                <div>
                  <span className="font-semibold">{t('username')} </span>
                  {userName}
                </div>
                <div>
                  <span className="font-semibold">{t('date')} </span>
                  {new Date(timestamp).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}

        {Activitylogs.length > 0 && (
          <div className="flex justify-center mt-6 space-x-4 ">
            <button
              onClick={handleClearActivityLogs}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              {t('delete_logger')}
            </button>
            <Link to="/home" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
              {t('back')}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLogger;
