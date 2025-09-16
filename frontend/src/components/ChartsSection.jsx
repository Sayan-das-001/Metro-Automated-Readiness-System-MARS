import React from 'react'
import { Bar, Pie, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

const ChartsSection = ({ trainData }) => {
  // Fitness Score Chart Data
  const getFitnessChartData = () => {
    if (!trainData || trainData.length === 0) {
      return {
        labels: [],
        datasets: []
      }
    }

    const sortedData = [...trainData].sort((a, b) => (b.fitness_score || 0) - (a.fitness_score || 0))
    
    return {
      labels: sortedData.map(train => train.train_id),
      datasets: [
        {
          label: 'Fitness Score',
          data: sortedData.map(train => train.fitness_score || 0),
          backgroundColor: sortedData.map(train => 
            train.final_decision === 'Induct' ? '#10b981' : '#ef4444'
          ),
          borderColor: sortedData.map(train => 
            train.final_decision === 'Induct' ? '#059669' : '#dc2626'
          ),
          borderWidth: 1,
        },
      ],
    }
  }

  // Depot Distribution Chart Data
  const getDepotChartData = () => {
    if (!trainData || trainData.length === 0) {
      return {
        labels: [],
        datasets: []
      }
    }

    const depotCounts = trainData.reduce((acc, train) => {
      const depot = train.depot || 'Unknown'
      acc[depot] = (acc[depot] || 0) + 1
      return acc
    }, {})

    return {
      labels: Object.keys(depotCounts),
      datasets: [
        {
          data: Object.values(depotCounts),
          backgroundColor: [
            '#3b82f6',
            '#10b981',
            '#f59e0b',
            '#ef4444',
            '#8b5cf6',
          ],
          borderColor: [
            '#2563eb',
            '#059669',
            '#d97706',
            '#dc2626',
            '#7c3aed',
          ],
          borderWidth: 2,
        },
      ],
    }
  }

  // Decision Summary Chart Data
  const getDecisionChartData = () => {
    if (!trainData || trainData.length === 0) {
      return {
        labels: [],
        datasets: []
      }
    }

    const decisionCounts = trainData.reduce((acc, train) => {
      const decision = train.final_decision || 'Unknown'
      acc[decision] = (acc[decision] || 0) + 1
      return acc
    }, {})

    return {
      labels: Object.keys(decisionCounts),
      datasets: [
        {
          data: Object.values(decisionCounts),
          backgroundColor: ['#10b981', '#ef4444', '#6b7280'],
          borderColor: ['#059669', '#dc2626', '#4b5563'],
          borderWidth: 2,
        },
      ],
    }
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  }

  const barChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%'
          }
        }
      },
      x: {
        ticks: {
          maxRotation: 45,
        }
      }
    },
    plugins: {
      ...chartOptions.plugins,
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Fitness: ${context.parsed.y}%`
          }
        }
      }
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Fitness Score Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Train Fitness Scores
        </h3>
        <div className="h-80">
          <Bar data={getFitnessChartData()} options={barChartOptions} />
        </div>
        <div className="mt-2 text-xs text-gray-500">
          <span className="inline-block w-3 h-3 bg-green-500 rounded mr-2"></span>
          Induct
          <span className="inline-block w-3 h-3 bg-red-500 rounded mr-2 ml-4"></span>
          Hold
        </div>
      </div>

      {/* Depot Distribution Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Train Distribution by Depot
        </h3>
        <div className="h-80">
          <Pie data={getDepotChartData()} options={chartOptions} />
        </div>
      </div>

      {/* Decision Summary Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Induction Decision Summary
        </h3>
        <div className="h-80">
          <Doughnut data={getDecisionChartData()} options={chartOptions} />
        </div>
      </div>

      {/* Fleet Health Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Fleet Health Overview
        </h3>
        <div className="space-y-4">
          {trainData && trainData.length > 0 && (
            <>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Excellent (90%+)</span>
                <span className="text-sm font-semibold text-green-600">
                  {trainData.filter(t => (t.fitness_score || 0) >= 90).length} trains
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Good (80-89%)</span>
                <span className="text-sm font-semibold text-blue-600">
                  {trainData.filter(t => (t.fitness_score || 0) >= 80 && (t.fitness_score || 0) < 90).length} trains
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Fair (70-79%)</span>
                <span className="text-sm font-semibold text-yellow-600">
                  {trainData.filter(t => (t.fitness_score || 0) >= 70 && (t.fitness_score || 0) < 80).length} trains
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Poor (&lt;70%)</span>
                <span className="text-sm font-semibold text-red-600">
                  {trainData.filter(t => (t.fitness_score || 0) < 70).length} trains
                </span>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">Average Fleet Fitness</span>
                  <span className="text-lg font-bold text-blue-600">
                    {trainData.length > 0 
                      ? (trainData.reduce((sum, t) => sum + (t.fitness_score || 0), 0) / trainData.length).toFixed(1)
                      : 0}%
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChartsSection