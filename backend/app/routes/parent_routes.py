
from flask import Blueprint, request, render_template, redirect, session, url_for
from bson.objectid import ObjectId
from app import mongo

bp = Blueprint('parent_routes', __name__, url_prefix='/parent')

@bp.route('/profile/<user_id>')
def profile(user_id):
    user = mongo.db.users.find_one({'_id': ObjectId(user_id)})
    children = list(mongo.db.children.find({'parent_id': ObjectId(user_id)}))
    return render_template('parent/profile.html', user=user, children=children)

@bp.route('/add_child/<user_id>', methods=['POST'])
def add_child(user_id):
    child = {
        'name': request.form['name'],
        'age': int(request.form['age']),
        'gender': request.form['gender'],
        'parent_id': ObjectId(user_id)
    }
    mongo.db.children.insert_one(child)
    return redirect(url_for('parent_routes.profile', user_id=user_id))
