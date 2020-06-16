import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { GraphContainer } from '../../template/graphContainer/GraphContainer';
import numeral from 'numeral';
import { usePromise } from '../../hooks/usePromise';
import { ServicesContext } from '../../context/ServicesContext';
import { chartLabel } from '../../hooks/blockNumbers.util';
import { usePeriod } from '../../hooks/usePeriod';

export function AragonParticipantsChart() {
  const services = useContext(ServicesContext);
  const { isLight, lightTheme, darkTheme } = useContext(ThemeContext);
  const theme = isLight ? lightTheme : darkTheme;
  const [period, setPeriod] = usePeriod();
  const { loading, error, data } = usePromise(services.antParticipants.timeseries(period), [period]);

  const handlePeriodChange = (period) => {
    setPeriod(period);
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner">
          <div className="double-bounce1" style={{ backgroundColor: theme.metricNumbers }} />
          <div className="double-bounce2" style={{ backgroundColor: theme.metricNumbers }} />
        </div>
      </div>
    );
  } else if (error) {
    return <>X_X</>;
  } else {
    const graphData = data.map((data) => {
      return {
        value: data.value,
        label: chartLabel(data.timestamp),
      };
    });
    const lastPoint = graphData[graphData.length - 1];
    const lastParticipants = numeral(lastPoint?.value).format('0.0a');
    return (
      <GraphContainer
        title="Participants"
        metric={lastParticipants}
        data={graphData}
        period={period}
        onPeriodChange={handlePeriodChange}
        metricTitle={theme.firstInSeries}
        metricNumber={theme.metricNumbers}
        pointColor={theme.firstInSeriesPoint}
        axesColor={theme.axesGridLines}
      />
    );
  }
}
