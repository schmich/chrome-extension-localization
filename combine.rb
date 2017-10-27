require 'json'
require 'set'

def message_ordinals(locale, commits)
  file = "src/_locales/#{locale}/messages.json"
  keys = JSON.parse(File.read(file)).keys

  lines = `git blame -c #{file}`.lines
  cur = keys.shift

  ordinals = {}
  lines.each do |line|
    if line =~ /^(.*?)\s+\(.*?\)\s+\"(#{cur})\":.*/
      commit = $1.strip.slice(0, 7)
      ordinals[$2.strip] = commits.index(commit)
      cur = keys.shift
    end
  end

  ordinals
end

def load_messages(locale)
  JSON.parse(File.read(File.join("src/_locales/#{locale}/messages.json")))
end

def commits_by_age
  `git log --pretty=%h`.lines.map(&:strip).select { |line| !line.empty? }.reverse
end

def translation_status
  status = {}
  commits = commits_by_age

  en_messages = load_messages('en')
  en_ordinals = message_ordinals('en', commits)

  Dir['src/_locales/*'].each do |entry|
    locale = entry.split('/').last
    next if ['en', 'en_GB'].include?(locale)

    ordinals = message_ordinals(locale, commits)
    messages = load_messages(locale)

    outdated = messages.select { |id, _| ordinals[id] < en_ordinals[id] }.map(&:first)
    missing = Set.new(en_messages.keys) - Set.new(messages.keys)
    identical = en_messages.merge(messages) { |_, l, r| l == r }.select { |_, v| v.is_a?(TrueClass) }.keys

    status[locale] = {
      missing: missing.to_a,
      outdated: outdated,
      identical: identical,
      messages: messages
    }
  end

  status['en'] = {
    messages: en_messages
  }

  status
end

puts JSON.pretty_generate(translation_status)
