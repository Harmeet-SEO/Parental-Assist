
#admin routes allow us to view the users and content on the website
#the dashboard gives us the capability to run CRUD operations with the content

from flask import Blueprint, render_template, request, redirect, session, url_for
from bson.objectid import ObjectId
from app import mongo

bp = Blueprint('admin_routes', __name__, url_prefix='/admin')

@bp.route('/dashboard')
def dashboard():
    if 'admin' not in session:
        return redirect(url_for('auth_routes.login'))
    users = list(mongo.db.users.find())
    return render_template('admin/dashboard.html', users=users)

@bp.route('/delete_user/<user_id>')
def delete_user(user_id):
    mongo.db.users.delete_one({'_id': ObjectId(user_id)})
    return redirect(url_for('admin_routes.dashboard'))

@bp.route('/add_content', methods=['GET', 'POST'])
def add_content():
    if request.method == 'POST':
        content = {
            'title': request.form['title'],
            'category': request.form['category'],
            'body': request.form['body']
        }
        mongo.db.content.insert_one(content)
        return redirect(url_for('admin_routes.dashboard'))

    return render_template('admin/content_form.html')
