require 'roda'
require 'sqlite3'
require 'bcrypt'
require 'json'

@@db = SQLite3::Database.open "db/db.db"
@@db.results_as_hash = true

class App < Roda
  plugin :render
  plugin :static, ['/fonts', '/images', '/js', '/styles']

  def result_to_a res
    res.map{|x| x}
  end

  route do |r|
    # view('view', template: 'layout')

    # r.root do
    #   view("index", template: 'layout')
    # end

    r.on "games", String do |game_name|
      game_data = @@db.prepare("select * from games where name = ?").execute(game_name)
      @name = game_name
      @game = result_to_a(game_data)[0]['type']

      r.is do
        r.get do
          players_q = @@db.prepare("select player, bracket from brackets where game = ?")

          @players = players_q.execute(game_name).map{|x| x}
          view("view", template: 'layout')
        end
      end

      r.get "view" do
        r.redirect "/games/#{game_name}"
      end

      # r.post "submit" do
      #   q = @@db.prepare("insert into brackets(game, player, bracket) values (?, ?, ?)")
      #   q.execute(game_name, r.params['name'], r.params['bracket'])
      #   r.redirect "/games/#{game_name}/view"
      # end
    end

    # r.post "create" do
    #   @error = true
    #   @name = r.params['name']
    #   @type = r.params['type']

    #   q = @@db.prepare("select name from games where name = ?")
    #   exists = result_to_a(q.execute(r.params['name'])).size > 0

    #   if exists
    #     puts result_to_a(q.execute(r.params['name']))
    #     view("index", template: 'layout')
    #   else
    #     create_q = @@db.prepare("insert into games (name, type) VALUES (?, ?)")
    #     create_q.execute(@name, @type)
    #     r.redirect "/games/#{@name}"
    #   end
    # end
  end
end

run App.freeze.app
