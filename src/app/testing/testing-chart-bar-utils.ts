import { StatisticSummary } from '../model/statistic-summary';
import * as _ from 'lodash';

export class TestingChartBarUtils {
    static dataSetIndex = {
        RED_WINS: 0,
        GREEN_WINS: 1,
        DRAWS: 2,
        AVG_SUCCESS_MOVES: 3,
        AVG_FAILED_MOVES: 4,

    }
    public static createInitialChartBarData() {
        return {
            labels: [],
            datasets: [
                {
                    label: 'Red Wins',
                    backgroundColor: '#f00',
                    stack: 'Stack WINs',
                    yAxisID: 'y-axis-Wins',
                    data: []
                },
                {
                    label: 'Green Wins',
                    backgroundColor: '#0f0',
                    stack: 'Stack WINs',
                    yAxisID: 'y-axis-Wins',
                    data: []
                },
                {
                    label: 'DRAWs',
                    backgroundColor: '#99f',
                    stack: 'Stack WINs',
                    yAxisID: 'y-axis-Wins',
                    data: []
                },
                {
                    label: 'Avg Success Moves',
                    backgroundColor: '#00f',
                    stack: 'Avg Success Moves',
                    yAxisID: 'y-axis-Moves',
                    data: [],
                },
                {
                    label: 'Avg Failed Moves',
                    backgroundColor: '#000',
                    stack: 'Avg Failed Moves',
                    yAxisID: 'y-axis-Moves',
                    data: [],
                },
            ]
        };
    }
    public static createChartBarOptions(label: string) {
        return {
            responsive: true,
            title: {
                display: true,
                text: label,
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            scales: {
                xAxes: [
                    {
                        stacked: true
                    },
                ],
                yAxes: [
                    {
                        id: 'y-axis-Wins',
                        position: 'left',
                        stacked: true,
                        ticks: {
                            max: 10,
                        }
                    },
                    {
                        id: 'y-axis-Moves',
                        position: 'right',
                        stacked: true,
                        ticks: {
                            max: 10,
                        }
                    },
                ]
            }
        };
    }
    public static addChartBarDataSet(
        data: any, label: string,
        statisticSummary: StatisticSummary) {

        this.updateChartBarDataSet(data, label, data.datasets[0].data.length, statisticSummary);
    }
    public static updateChartBarDataSet(
        data: any, label: string, index: number,
        statisticSummary: StatisticSummary) {

        if (label) {
            data.labels[index] = label;
        } else if (data.labels.length > 0) {
            throw Error('Label is required');
        }
        data.datasets[this.dataSetIndex.RED_WINS].data[index] = statisticSummary.redWins;
        data.datasets[this.dataSetIndex.GREEN_WINS].data[index] = statisticSummary.greenWins;
        data.datasets[this.dataSetIndex.DRAWS].data[index] = statisticSummary.draws;
        data.datasets[this.dataSetIndex.AVG_SUCCESS_MOVES].data[index] =
            _.round(statisticSummary.countSuccessMoves / statisticSummary.countGames, 5);
        data.datasets[this.dataSetIndex.AVG_FAILED_MOVES].data[index] =
            _.round(statisticSummary.countFailedMoves / statisticSummary.countGames, 5);
    }
}
