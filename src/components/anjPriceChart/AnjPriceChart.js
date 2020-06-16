import { GraphContainer } from '../../template/graphContainer/GraphContainer';
import React, { useContext, useMemo } from 'react';
import numeral from 'numeral';
import { useTheme } from '../../hooks/useTheme';
import { ServicesContext } from '../../context/ServicesContext';
import { usePromise } from '../../hooks/usePromise';
import { chartLabel } from '../../hooks/blockNumbers.util';
import { usePeriod } from '../../hooks/usePeriod';

export function AnjPriceChart() {
  const services = useContext(ServicesContext);
  const theme = useTheme();
  const [period, setPeriod] = usePeriod();
  const anjPrice = usePromise(services.anjPrice.timeseries(period), [period]);

  const handlePeriodChange = (period) => {
    setPeriod(period);
  };

  const timeseries = useMemo(() => {
    if (anjPrice.data) {
      return anjPrice.data.map((point) => {
        return {
          value: point.value,
          label: chartLabel(point.timestamp),
        };
      });
    }
  }, [anjPrice.data]);

  const lastPointFormatted = useMemo(() => {
    if (timeseries) {
      const lastPoint = timeseries[timeseries.length - 1].value;
      return numeral(lastPoint).format('$0.000a');
    }
  }, [timeseries]);

  if (anjPrice.loading) {
    return (
      <div className="spinner-container">
        <div className="spinner">
          <div className="double-bounce1" style={{ backgroundColor: theme.metricNumbers }} />
          <div className="double-bounce2" style={{ backgroundColor: theme.metricNumbers }} />
        </div>
      </div>
    );
  } else if (anjPrice.error) {
    return <>X_X</>;
  } else {
    return (
      <GraphContainer
        title="Price"
        metric={lastPointFormatted}
        data={timeseries}
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
