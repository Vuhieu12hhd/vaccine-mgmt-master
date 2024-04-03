import Loader from 'components/Loader';
import Switch from 'elements/Switch';
import { HealthSurvey } from 'interfaces/models';
import React, { useEffect, useState } from 'react';
import { getHealthSurvey } from 'services/vaccine';

interface HealthSurveyTemplateProps {
  onChange?: (data: HealthSurvey[]) => void;
  initData?: Record<string, string>[];
  readOnly?: boolean;
}

const HealthSurveyTemplate = (props: HealthSurveyTemplateProps) => {
  const [loading, setLoading] = useState(true);
  const [healthSurvey, setHealthSurvey] = useState<HealthSurvey[]>([]);

  useEffect(() => {
    queryData();
  }, []);

  const queryData = async () => {
    setLoading(true);
    try {
      const res = await getHealthSurvey();
      const initAnswer = {} as Record<string, string>;
      props.initData?.forEach(item => {
        initAnswer[item.healthSurveyTemplateId] = item.choice;
      })
      const list = (res.result.items as HealthSurvey[]).map(item => ({
        ...item,
        checked: Number(initAnswer[item.id]) === 1
      }))
      setHealthSurvey(list);
      props.onChange?.(list);
    } catch (error) { }
    setLoading(false);
  };

  return (
    <Loader active={loading}>
      {healthSurvey.map((item, idx) => (
        <div key={idx} className="flex items-center justify-between">
          <div>{item.title}</div>
          <div>
            <Switch
              checked={item.checked}
              readOnly={props.readOnly}
              onChange={checked => {
                item.checked = checked;
                setHealthSurvey([...healthSurvey]);
                props.onChange?.([...healthSurvey]);
              }}
            />
          </div>
        </div>
      ))}
    </Loader>
  );
};

export default HealthSurveyTemplate;
