import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, Check, Copy, Download, Clock, Zap } from 'lucide-react'
import { api } from '../utils/api'
import QRCode from 'react-qr-code'

const CreatePoll = () => {
  const [title, setTitle] = useState('')
  const [options, setOptions] = useState(['', ''])
  const [settings, setSettings] = useState({
    multipleChoice: false,
    showResults: true,
    allowRevote: false,
    duration: null,
    showResultsBeforeEnd: false
  })
  const [customDuration, setCustomDuration] = useState('')
  const [createdPoll, setCreatedPoll] = useState(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  // Quick duration presets (in minutes)
  const durationPresets = [
    { label: '5 min', value: 5, icon: Zap },
    { label: '10 min', value: 10, icon: Clock },
    { label: '30 min', value: 30, icon: Clock },
    { label: '1 hour', value: 60, icon: Clock },
    { label: 'No limit', value: null, icon: Clock }
  ]

  const addOption = () => {
    setOptions([...options, ''])
  }

  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index))
    }
  }

  const updateOption = (index, value) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!title.trim()) {
      alert('Please enter a poll title')
      return
    }
    
    const validOptions = options.filter(opt => opt.trim() !== '')
    if (validOptions.length < 2) {
      alert('Please enter at least 2 options')
      return
    }
    
    setLoading(true)
    try {
      const response = await api.createPoll({
        title: title.trim(),
        options: validOptions,
        settings
      })
      
      if (response.success) {
        setCreatedPoll(response.poll)
      }
    } catch (error) {
      console.error('Error creating poll:', error)
      alert('Failed to create poll. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadQR = () => {
    const svg = document.getElementById('qr-code')
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL('image/png')
      
      const downloadLink = document.createElement('a')
      downloadLink.download = `poll-${createdPoll.code}.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
  }

  if (createdPoll) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card text-center"
        >
          <div className="mb-8">
            <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
              <Check className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold mb-2 text-gray-800">Poll Created Successfully!</h2>
            <p className="text-gray-600">Share this code or QR code with participants</p>
          </div>

          <div className="bg-gradient-to-br from-church-50 to-primary-50 rounded-xl p-8 mb-8">
            <h3 className="text-xl font-bold mb-4 text-gray-700">Poll Code</h3>
            <div className="flex items-center justify-center gap-4">
              <div className="text-5xl font-bold tracking-wider bg-gradient-to-r from-church-600 to-primary-600 bg-clip-text text-transparent">
                {createdPoll.code}
              </div>
              <button
                onClick={() => copyToClipboard(createdPoll.code)}
                className="p-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                {copied ? (
                  <Check className="h-5 w-5 text-green-600" />
                ) : (
                  <Copy className="h-5 w-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-inner mb-8">
            <h3 className="text-xl font-bold mb-4 text-gray-700">QR Code</h3>
            <div className="flex justify-center mb-4">
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <QRCode
                  id="qr-code"
                  value={createdPoll.code}
                  size={200}
                  level="H"
                />
              </div>
            </div>
            <button
              onClick={downloadQR}
              className="btn-secondary inline-flex items-center gap-2"
            >
              <Download className="h-5 w-5" />
              Download QR Code
            </button>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => window.open(`/poll/${createdPoll.id}/results`, '_blank')}
              className="btn-primary w-full"
            >
              View Results Dashboard
            </button>
            <button
              onClick={() => {
                setCreatedPoll(null)
                setTitle('')
                setOptions(['', ''])
              }}
              className="btn-secondary w-full"
            >
              Create Another Poll
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-church-700 to-primary-700 bg-clip-text text-transparent">
          Create a New Poll
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Poll Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Poll Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Vote for Best Church Choir 2024"
              className="input-field"
              required
            />
          </div>

          {/* Options */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Options *
            </label>
            <div className="space-y-3">
              {options.map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="input-field"
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
            <button
              type="button"
              onClick={addOption}
              className="mt-3 flex items-center gap-2 text-church-600 hover:text-church-700 font-semibold"
            >
              <Plus className="h-5 w-5" />
              Add Option
            </button>
          </div>

          {/* Settings */}
          <div className="bg-gray-50 rounded-xl p-6 space-y-6">
            <h3 className="font-semibold text-gray-700">Poll Settings</h3>
            
            {/* Duration Settings */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" style={{ color: '#5B4A9D' }} />
                <label className="font-medium text-gray-700">Poll Duration</label>
              </div>
              
              {/* Quick Presets */}
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {durationPresets.map((preset) => {
                  const Icon = preset.icon
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setSettings({ ...settings, duration: preset.value })
                        setCustomDuration('')
                      }}
                      className={`px-3 py-2 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-1 ${
                        settings.duration === preset.value
                          ? 'text-white shadow-md'
                          : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300'
                      }`}
                      style={settings.duration === preset.value ? { backgroundColor: '#5B4A9D' } : {}}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{preset.label}</span>
                    </button>
                  )
                })}
              </div>

              {/* Custom Duration */}
              <div className="flex gap-2">
                <input
                  type="number"
                  value={customDuration}
                  onChange={(e) => {
                    setCustomDuration(e.target.value)
                    if (e.target.value) {
                      setSettings({ ...settings, duration: parseInt(e.target.value) })
                    }
                  }}
                  placeholder="Custom minutes"
                  className="input-field flex-1"
                  min="1"
                  max="1440"
                />
                <span className="flex items-center text-gray-500 text-sm">minutes</span>
              </div>
              
              {settings.duration && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg text-sm"
                  style={{ backgroundColor: '#f5f3ff', color: '#5B4A9D' }}
                >
                  Poll will close automatically after {settings.duration} minute{settings.duration !== 1 ? 's' : ''}
                </motion.div>
              )}
            </div>

            {/* Other Settings */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.multipleChoice}
                  onChange={(e) => setSettings({ ...settings, multipleChoice: e.target.checked })}
                  className="w-5 h-5 rounded focus:ring-2"
                  style={{ color: '#5B4A9D', accentColor: '#5B4A9D' }}
                />
                <div>
                  <div className="font-medium text-gray-700">Multiple Choice</div>
                  <div className="text-sm text-gray-500">Allow voters to select multiple options</div>
                </div>
              </label>

              {settings.duration && (
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.showResultsBeforeEnd}
                    onChange={(e) => setSettings({ ...settings, showResultsBeforeEnd: e.target.checked })}
                    className="w-5 h-5 rounded focus:ring-2"
                    style={{ color: '#5B4A9D', accentColor: '#5B4A9D' }}
                  />
                  <div>
                    <div className="font-medium text-gray-700">Show Live Results</div>
                    <div className="text-sm text-gray-500">Display vote counts during voting (Mentimeter-style)</div>
                  </div>
                </label>
              )}

              {!settings.duration && (
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.showResults}
                    onChange={(e) => setSettings({ ...settings, showResults: e.target.checked })}
                    className="w-5 h-5 rounded focus:ring-2"
                    style={{ color: '#5B4A9D', accentColor: '#5B4A9D' }}
                  />
                  <div>
                    <div className="font-medium text-gray-700">Show Results</div>
                    <div className="text-sm text-gray-500">Display results to voters after they vote</div>
                  </div>
                </label>
              )}

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.allowRevote}
                  onChange={(e) => setSettings({ ...settings, allowRevote: e.target.checked })}
                  className="w-5 h-5 rounded focus:ring-2"
                  style={{ color: '#5B4A9D', accentColor: '#5B4A9D' }}
                />
                <div>
                  <div className="font-medium text-gray-700">Allow Re-voting</div>
                  <div className="text-sm text-gray-500">Let voters change their vote</div>
                </div>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Poll...' : 'Create Poll'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

export default CreatePoll
