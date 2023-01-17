// This file is auto-generated by ./bin/rails stimulus:manifest:update
// Run that command whenever you add a new controller or create them with
// ./bin/rails generate stimulus controllerName

import { application } from "./application"

import BoardController from "./board_controller"
application.register("board", BoardController)

import MessageController from "./message_controller"
application.register("message", MessageController)

import MovesController from "./moves_controller"
application.register("moves", MovesController)

import SettingsController from "./settings_controller"
application.register("settings", SettingsController)

import TimerController from "./timer_controller"
application.register("timer", TimerController)
