// This file is auto-generated by ./bin/rails stimulus:manifest:update
// Run that command whenever you add a new controller or create them with
// ./bin/rails generate stimulus controllerName

import { application } from "./application"

import AlertController from "./alert_controller"
application.register("alert", AlertController)

import BoardController from "./board_controller"
application.register("board", BoardController)

import FilterController from "./filter_controller"
application.register("filter", FilterController)

import MessageController from "./message_controller"
application.register("message", MessageController)

import MovesController from "./moves_controller"
application.register("moves", MovesController)

import StoreController from "./store_controller"
application.register("store", StoreController)

import TimerController from "./timer_controller"
application.register("timer", TimerController)